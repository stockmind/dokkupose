<template>
  <div class="wrapper columns is-multiline is-centered">
    <div class="app-wrapper column is-full">
      <h1 class="h-title dokkupose">Dokkupose</h1>
      <h1 class="h-title mb-4">
        <span class="docker-compose">
          <img class="logo" src="../assets/docker-compose.png" />
          docker-compose.yml</span
        >
        to
        <span class="dokku"
          ><img class="logo" src="../assets/dokku.png" /> Dokku</span
        >
        commands
      </h1>
      <p class="has-text-warning">
        <b-icon pack="fas" icon="exclamation-triangle" class="mr-1" />
        This service is an hobby project developed during free-time to automate
        boring conversions.<br />
        Always double-check the generated code before using it in your machine.
        We take no responsibility or liability for any damage or data loss you
        may encounter using this software.
      </p>
    </div>
    <div class="logo-wrapper column is-full">
      <img class="logo" src="../assets/docker-compose.png" />
      <h4 class="logo h-title">docker-compose.yml:</h4>
      <p>
        <b-icon pack="fas" icon="copy" class="mr-1" />Paste and start from your
        docker-compose.
      </p>
    </div>
    <div class="column is-full">
      <MonacoEditor
        class="editor"
        v-model="code"
        theme="vs-dark"
        language="yaml"
        :options="editorOptions"
      />
    </div>
    <div class="logo-wrapper column is-full">
      <h4 class="logo h-title">Services:</h4>
      <p class="mb-0">
        <b-icon pack="fas" icon="hand-pointer" class="mr-1" />Click on names and
        values on tags/badges below to edit.
      </p>
      <p class="has-text-warning">
        <b-icon pack="fas" icon="exclamation-triangle" class="mr-1" />If you
        update your docker-compose above, your changes below will be
        lost/overwritten.
      </p>
    </div>
    <div class="logo-wrapper column is-full">
      <div class="columns is-multiline">
        <div class="column is-full" v-if="false">
          <b-field>
            <b-radio-button
              v-model="layout"
              native-value="is-full"
              type="is-primary is-dark"
            >
              <b-icon icon="close"></b-icon>
              <span>Full width</span>
            </b-radio-button>

            <b-radio-button
              v-model="layout"
              native-value="is-6"
              type="is-primary is-dark"
            >
              <b-icon icon="check"></b-icon>
              <span>2 columns</span>
            </b-radio-button>

            <b-radio-button
              v-model="layout"
              native-value="is-4"
              type="is-primary is-dark"
            >
              <span>3 columns</span>
            </b-radio-button>
          </b-field>
        </div>
        <div
          :class="`column ${layout}`"
          v-for="(serviceSettings, serviceName) in parsedYaml.services"
          :key="serviceName"
        >
          <Service
            :settings="serviceSettings"
            :name="serviceName"
            :color="servicesColors[serviceName]"
          >
          </Service>
        </div>
      </div>
    </div>
    <p class="mt-2">
      <b-icon pack="fas" icon="info-circle" class="mr-1" />
      For any questions or bugs feel free to fill an issue or MR on the
      <a href="https://github.com/stockmind/dokkupose" target="_blank"
        ><b-icon pack="fab" icon="github" /> GitHub page</a
      >
      of the project.
    </p>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
import _ from "lodash";
import distinctColors from "distinct-colors";
import Service from "./Service.vue";
import ComposeNormalizer from "../modules/ComposeNormalizer";

export default {
  props: {
    msg: String,
  },
  data() {
    return {
      appName: "",
      layout: "is-6",
      editorOptions: { automaticLayout: true },
      code: `version: "3.9"
services:
  my-web-app:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/uploads
    environment:
      FLASK_ENV: development
  my-service-from-image:
    image: "user/image:latest"
  my-redis:
    # If the converter recognizes an image for which a plugin exists, the dokku plugin will be used.
    image: "redis:latest"`,
    };
  },
  computed: {
    parsedYaml() {
      return ComposeNormalizer.parseDockerCompose(this.code);
    },
    servicesColors() {
      const services = Object.keys(this.parsedYaml.services);
      if (services.length) {
        const colors = distinctColors({
          count: services.length,
          lightMin: 70,
          lightMax: 90,
        });
        return _.reduce(
          services,
          (output, service, index) => {
            output[service] = {
              header: colors[index].hex(),
              body: colors[index].luminance(0.89).hex(),
              border: colors[index].luminance(0.19).hex(),
            };
            return output;
          },
          {}
        );
      }
      return [];
    },
    dokkuRecipe() {
      return _.map(this.parsedYaml.services, (serviceOptions, serviceName) =>
        ComposeNormalizer.dokkuRecipe(serviceOptions, serviceName)
      ).join("\n\n");
    },
  },
  methods: {},
  components: {
    MonacoEditor,
    Service,
  },
};
</script>

<style scoped>
.dokkupose {
  font-size: 64px;
  color: #ebebeb;
}
.wrapper {
  margin-top: 20px;
  color: #dedede;
  text-align: left;
}
.editor {
  height: 300px;
}
.logo {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 0;
}
img.logo {
  height: 40px;
  margin-right: 15px;
}
.docker-compose img.logo,
.dokku img.logo {
  margin-right: 5px;
}
.h-title {
  color: #dedede;
}
.logo-wrapper,
.app-wrapper {
  text-align: center;
}
.dokku {
  border-bottom: 4px solid #07cbcf;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
}
.docker-compose {
  border-bottom: 4px solid #266686;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
}
</style>
