import urlJoin from "url-join";
import YAML from "yaml";
import _ from "lodash";

const plugins = [
  { name: "redis", regex: /redis/ },
  { name: "mysql", regex: /mysql/ },
  { name: "mariadb", regex: /mariadb/ },
  { name: "postgres", regex: /postgres/ },
  { name: "mongodb", regex: /mongodb/ },
];
const dokkuPath = "/var/lib/dokku/data/storage/";

const parseDockerCompose = function(yaml) {
  const servicesConfig = YAML.parse(yaml);
  _.each(servicesConfig.services, (serviceOptions, serviceName) => {
    const generatedServiceName = generateServiceName(serviceName);

    // Check if image match with a known plugin
    if (serviceOptions.image) {
      const [image, version] = serviceOptions.image.split(":");
      serviceOptions.matchingPlugin = _.find(plugins, (plugin) =>
        image.match(plugin.regex)
      );
      if (serviceOptions.matchingPlugin) {
        serviceOptions.matchingPlugin = {
          ...serviceOptions.matchingPlugin,
          version: version,
        };
      }
    }
    // Ports
    servicesConfig.services[serviceName].ports = ports(serviceOptions.ports);
    // Environment
    servicesConfig.services[serviceName].environment = environment(
      serviceOptions.environment
    );
    // Volumes
    servicesConfig.services[serviceName].volumes = volumes(
      serviceOptions.volumes,
      generatedServiceName
    );
    // Domains
    serviceOptions.domains = [];
    return serviceOptions;
  });
  return servicesConfig;
};

const generateServiceName = function(serviceName) {
  return serviceName.replace(/\s+/g, "-");
};

const ports = function(ports) {
  return _.map(ports, (port) => {
    const [host, container] = port.split(":");
    return {
      host: host,
      // Remove protocol from ports definition like 12345/udp
      container: container.replace(/\/.*$/, ""),
    };
  });
};

const environment = function(environment) {
  if (_.isArray(environment)) {
    return _.map(environment, (envVariable) => {
      const [envID, envValue] = envVariable.split("=");
      return {
        identifier: envID,
        value: envValue,
      };
    });
  } else {
    return _.map(environment, (envValue, envID) => ({
      identifier: envID,
      value: envValue,
    }));
  }
};

const volumes = function(volumes, serviceName) {
  return _.map(volumes, (volume) => {
    let [hostFolder, containerFolder] = volume.split(":");

    // replace paths like '.' to last folder name of container folder, eg: '.:/app/code' -> 'code:/app/code'
    if ([".", "./"].indexOf(hostFolder) !== -1) {
      hostFolder = containerFolder.match(/([^/]*)\/*$/)[1];
    }
    // remove starting './' from host path
    hostFolder = hostFolder.replace(/^\.\//, "");

    const dokkuHostAppStorageRelativeFolder = urlJoin(hostFolder);

    const dokkuHostAppStorageFolder = urlJoin(
      dokkuPath,
      serviceName,
      hostFolder
    );

    return {
      hostRelative: dokkuHostAppStorageRelativeFolder,
      hostFullPath: dokkuHostAppStorageFolder,
      container: containerFolder,
    };
  });
};

export default {
  generateServiceName,
  parseDockerCompose,
  ports,
  environment,
  volumes,
  dokkuRecipe(serviceOptions, serviceName) {
    const generatedServiceName = generateServiceName(serviceName);
    let output = `# ${generatedServiceName}\n`;

    // App creation
    if (serviceOptions.matchingPlugin) {
      output += `dokku ${serviceOptions.matchingPlugin.name}:create ${generatedServiceName} --image-version "${serviceOptions.matchingPlugin.version}"\n`;
      output += `# link ${serviceName} to your application with:\n#dokku ${serviceOptions.matchingPlugin.name}:link ${generatedServiceName} <application>\n`;
    } else {
      output += `dokku apps:create ${generatedServiceName}\n`;
    }

    // Ports
    if (serviceOptions.ports && serviceOptions.ports.length) {
      output += `# configure ports of ${generatedServiceName}\n`;
      output += _.map(
        serviceOptions.ports,
        (port) =>
          `dokku proxy:ports-add ${generatedServiceName} http:${port.host}:${port.container}\n`
      ).join("");
    }

    // Volumes
    if (serviceOptions.volumes && serviceOptions.volumes.length) {
      output += `# configure volumes of ${generatedServiceName}\n`;
      output += _.map(serviceOptions.volumes, (volume) => {
        const hostFullPath = urlJoin(
          "/var/lib/dokku/data/storage/",
          generatedServiceName,
          volume.hostRelative
        );
        return `sudo -u dokku mkdir -p ${hostFullPath}\ndokku storage:mount ${generatedServiceName} ${hostFullPath}:${volume.container}\n`;
      }).join("\n");
    }

    // Environment
    if (serviceOptions.environment && serviceOptions.environment.length) {
      output += `# configure environment of ${generatedServiceName}\n`;
      output +=
        _.map(serviceOptions.environment, (envVariable) => {
          return `dokku config:set --no-restart ${generatedServiceName} ${envVariable.identifier}="${envVariable.value}"`;
        }).join("\n") + "\n";
    }

    // Domains
    if (serviceOptions.domains && serviceOptions.domains.length) {
      output += `# configure domains of ${generatedServiceName}\n`;
      output +=
        _.map(serviceOptions.domains, (domain) => {
          return `dokku domains:add ${generatedServiceName} "${domain.name}"`;
        }).join("\n") + "\n";
    }

    // Deploy
    if (serviceOptions.image && !serviceOptions.matchingPlugin) {
      output += `# assign image to ${generatedServiceName}\n`;
      output += `dokku git:from-image ${generatedServiceName} ${serviceOptions.image}\n`;
    } else if (serviceOptions.build) {
      output += `\n# on your local repository to deploy to ${generatedServiceName}\n`;
      output += `git remote add dokku dokku@example.com:${generatedServiceName}\ngit push dokku\n`;
    }
    return output;
  },
};
