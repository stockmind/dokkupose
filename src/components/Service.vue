<template>
  <div
    class="card"
    :style="{
      'border-color': color.header,
      'border-width': '3px',
      'border-style': 'solid',
      'background-color': color.body,
    }"
  >
    <header
      class="card-header"
      :style="{
        'background-color': color.header,
      }"
    >
      <p class="card-header-title mb-0 pt-1 pb-1 pl-2 pr-2">
        <b-icon
          pack="fas"
          icon="box-open"
          :style="{ color: color.border }"
          class="mr-1"
        >
        </b-icon>
        <span class="title is-3"
          ><contenteditable
            tag="span"
            :contenteditable="true"
            v-model="lclName"
            :noNL="true"
            :noHTML="true"
        /></span>
      </p>
      <div
        @click="hidden = !hidden"
        class="pointer is-flex is-align-items-center is-justify-content-center"
      >
        <b-icon
          pack="fas"
          :icon="hidden ? 'sort-down' : 'sort-up'"
          :style="{ color: color.border }"
          aria-label="more options"
        >
        </b-icon>
      </div>
    </header>
    <div class="card-content pt-2 pb-0 pr-3 pl-3" v-if="!hidden">
      <div class="content has-text-left">
        <b-switch
          v-if="false"
          v-model="image"
          :rounded="false"
          :outlined="true"
          size="is-small"
          type="is-primary"
          :left-label="true"
          >Build/Image</b-switch
        >
        <div class="control mb-3" v-if="lclSettings.matchingPlugin">
          <div class="tags has-addons">
            <span class="tag is-dark"
              ><strong class="text-white">plugin</strong></span
            >
            <span
              class="tag"
              :class="{
                'is-repository': !lclSettings.image,
                'is-image': lclSettings.image,
              }"
              ><strong class="text-white"
                >{{ lclSettings.matchingPlugin.name }}:{{
                  lclSettings.matchingPlugin.version
                }}</strong
              ></span
            >
          </div>
        </div>
        <div class="control mb-3" v-else>
          <div class="tags has-addons">
            <span class="tag is-dark"
              ><strong class="text-white">{{
                lclSettings.image ? "image" : "build"
              }}</strong>
            </span>
            <span
              class="tag"
              :class="{
                'is-repository': !lclSettings.image,
                'is-image': lclSettings.image,
              }"
              ><strong class="text-white">{{
                lclSettings.image ? lclSettings.image : "repository"
              }}</strong></span
            >
          </div>
        </div>
        <template v-if="!lclSettings.matchingPlugin">
          <h6 class="title is-6 mb-2">
            <b-icon
              pack="fas"
              icon="map-signs"
              :style="{ color: color.border }"
              class="mr-1"
            />Ports
          </h6>
          <div class="content mb-3">
            <b-field v-for="(port, index) in lclSettings.ports" :key="index">
              <b-tag
                type="is-ports"
                closable
                attached
                close-type="is-dark"
                @close="lclSettings.ports.splice(index, 1)"
                ><strong class="text-white"
                  ><contenteditable
                    tag="span"
                    :contenteditable="true"
                    :value="port.host"
                    :noNL="true"
                    :noHTML="true"
                    @input="
                      (value) => updatePort(index, value, port.container)
                    "
                /></strong>
                →
                <contenteditable
                  tag="span"
                  :contenteditable="true"
                  :value="port.container"
                  :noNL="true"
                  :noHTML="true"
                  @input="(value) => updatePort(index, port.host, value)"
                />
                <b-icon pack="fas" icon="pen" class="ml-2 is-xsmall" />
              </b-tag>
            </b-field>
            <b-button
              size="is-small"
              type="is-ghost"
              class="p-2"
              icon-pack="fas"
              icon-left="plus"
              :style="{ color: color.border + '!important' }"
              @click="
                () => lclSettings.ports.push({ host: '80', container: '5000' })
              "
              >Add port</b-button
            >
          </div>

          <h6 class="title is-6 mb-2">
            <b-icon
              pack="fas"
              icon="key"
              :style="{ color: color.border }"
              class="mr-1"
            />Environment
          </h6>
          <div class="content mb-3">
            <b-field
              v-for="(envVariable, index) in lclSettings.environment"
              :key="index"
            >
              <b-tag
                type="is-environment"
                closable
                close-type="is-dark"
                attached
                @close="lclSettings.environment.splice(index, 1)"
              >
                <strong class="text-white"
                  ><contenteditable
                    tag="span"
                    :contenteditable="true"
                    :value="envVariable.identifier"
                    :noNL="true"
                    :noHTML="true"
                    @input="
                      (value) =>
                        updateEnvironment(index, value, envVariable.value)
                    "
                /></strong>
                →
                <contenteditable
                  tag="span"
                  :contenteditable="true"
                  :value="envVariable.value"
                  :noNL="true"
                  :noHTML="true"
                  @input="
                    (value) =>
                      updateEnvironment(index, envVariable.identifier, value)
                  "
                />
                <b-icon pack="fas" icon="pen" class="ml-2 is-xsmall" />
              </b-tag>
            </b-field>
            <b-button
              size="is-small"
              type="is-ghost"
              class="p-2"
              icon-pack="fas"
              icon-left="plus"
              :style="{ color: color.border + '!important' }"
              @click="
                () =>
                  lclSettings.environment.push({
                    identifier: 'ID',
                    value: 'VALUE',
                  })
              "
              >Add environment variable</b-button
            >
          </div>

          <h6 class="title is-6 mb-2">
            <b-icon
              pack="fas"
              icon="folder-open"
              :style="{ color: color.border }"
              class="mr-1"
            />Volumes
          </h6>
          <div class="content mb-3">
            <b-field
              v-for="(volume, index) in lclSettings.volumes"
              :key="index"
            >
              <b-tag
                type="is-volume"
                closable
                close-type="is-dark"
                attached
                @close="lclSettings.volumes.splice(index, 1)"
              >
                <strong class="text-white"
                  >[...]/{{ lclName }}/<contenteditable
                    tag="span"
                    :contenteditable="true"
                    v-model="volume.hostRelative"
                    :noNL="true"
                    :noHTML="true"
                /></strong>
                →
                <contenteditable
                  tag="span"
                  :contenteditable="true"
                  v-model="volume.container"
                  :noNL="true"
                  :noHTML="true"
                />
                <b-icon pack="fas" icon="pen" class="ml-2 is-xsmall" />
              </b-tag>
            </b-field>
            <b-button
              size="is-small"
              type="is-ghost"
              class="p-2"
              icon-pack="fas"
              icon-left="plus"
              :style="{ color: color.border + '!important' }"
              @click="
                () =>
                  lclSettings.volumes.push({
                    hostRelative: 'path',
                    container: 'path',
                  })
              "
              >Add volume</b-button
            >
          </div>

          <h6 class="title is-6 mb-2">
            <b-icon
              pack="fas"
              icon="at"
              :style="{ color: color.border }"
              class="mr-1"
            /><span>Domains</span>
          </h6>
          <div class="content mb-3">
            <b-field
              v-for="(domain, index) in lclSettings.domains"
              :key="index"
            >
              <b-tag
                type="is-domain"
                closable
                close-type="is-dark"
                attached
                @close="lclSettings.domains.splice(index, 1)"
              >
                <strong class="text-white"
                  ><contenteditable
                    tag="span"
                    :contenteditable="true"
                    :value="domain.name"
                    :noNL="true"
                    :noHTML="true"
                    @input="(value) => updateDomain(index, value)"
                /></strong>
                <b-icon pack="fas" icon="pen" class="ml-2 is-xsmall" />
              </b-tag>
            </b-field>
            <b-button
              size="is-small"
              type="is-ghost"
              class="p-2"
              icon-pack="fas"
              icon-left="plus"
              :style="{ color: color.border + '!important' }"
              @click="
                () =>
                  lclSettings.domains.push({
                    name: 'example.com',
                  })
              "
              >Add domain</b-button
            >
          </div>
        </template>
      </div>
    </div>
    <div
      class="card-content pt-2 pr-0 pl-0 pb-0 has-text-left"
      :style="{
        'background-color': color.body,
      }"
    >
      <h6 class="title is-6 mb-2 ml-3">
        <img class="logo" src="../assets/dokku.png" /><span class="logo"
          >Dokku commands</span
        >
      </h6>
      <div class="content is-full has-text-left">
        <MonacoEditor
          class="editor m-0"
          :value="dokkuRecipe"
          :options="editorOptions"
          @editorDidMount="editorDidMount"
          language="dokku"
          theme="vs-dark-dokku"
          ref="editor"
        />
      </div>
    </div>
    <footer class="card-footer"></footer>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
import _ from "lodash";
import ComposeNormalizer from "../modules/ComposeNormalizer";
import dokkuCommands from "../modules/dokkuCommands";

export default {
  props: {
    name: { type: String, default: "" },
    color: {
      type: Object,
      default: () => ({
        header: "#dddddd",
        body: "#ffffff",
        border: "#dddddd",
      }),
    },
    settings: Object,
  },
  watch: {
    settings(newValue, oldValue) {
      if (!_.isEqual(newValue, oldValue)) {
        this.lclSettings = newValue;
      }
    },
  },
  data() {
    return {
      hidden: false,
      image: this.settings.image || false,
      lclName: this.name,
      lclSettings: this.settings,
      editorOptions: {
        automaticLayout: true,
        suggest: {
          snippetsPreventQuickSuggestions: false,
        },
      },
    };
  },
  computed: {
    dokkuRecipe() {
      return ComposeNormalizer.dokkuRecipe(this.lclSettings, this.lclName);
    },
  },
  methods: {
    updatePort(index, host, container) {
      this.$set(this.lclSettings.ports[index], "host", host);
      this.$set(this.lclSettings.ports[index], "container", container);
    },
    updateEnvironment(index, identifier, value) {
      this.$set(this.lclSettings.environment[index], "identifier", identifier);
      this.$set(this.lclSettings.environment[index], "value", value);
    },
    updateVolume(index, host, container) {
      this.$set(this.lclSettings.volumes[index], "hostRelative", host);
      this.$set(this.lclSettings.volumes[index], "container", container);
    },
    updateDomain(index, name) {
      this.$set(this.lclSettings.domains[index], "name", name);
    },
    editorDidMount() {
      const monaco = this.$refs.editor.monaco;
      // Register new language for dokku if missing
      if (!_.find(monaco.languages.getLanguages(), { id: "dokku" })) {
        // Register a new language
        monaco.languages.register({ id: "dokku" });

        // Register a tokens provider for the language
        monaco.languages.setMonarchTokensProvider("dokku", {
          includeLF: true,

          tokenizer: {
            root: [
              [/\s+/, "white"],
              [/^dokku\s+/, { token: "custom-dokku", next: "@options" }],
              // comments
              { include: "@comments" },
              // strings
              { include: "@strings" },
              // parameters
              { include: "@parameters" },
              // numbers
              { include: "@numbers" },
              [/^[\w-]*/, "keyword"],
            ],
            options: [
              [/([\w-]+):/, { token: "custom-dokku-options-left" }],
              [
                /([\w-]+)/,
                { token: "custom-dokku-options-right", next: "@appname" },
              ],
            ],
            appname: [
              [/\n|$/, { token: "", next: "@popall" }],
              [/(--[\w-]+)/, "custom-dokku-options-argument"],
              [
                /[\w-]+/,
                { token: "custom-dokku-options-appname", next: "@popall" },
              ],
            ],
            numbers: [
              [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
              [/0[xX][0-9a-fA-F_]*[0-9a-fA-F]/, "number.hex"],
              [/\d+/, "number"],
            ],
            // Recognize strings, including those broken across lines
            strings: [
              [/'/, "string", "@stringBody"],
              [/"/, "string", "@dblStringBody"],
            ],
            stringBody: [
              [/'/, "string", "@popall"],
              [/./, "string"],
            ],
            dblStringBody: [
              [/"/, "string", "@popall"],
              [/./, "string"],
            ],
            comments: [
              [/#!.*/, "metatag", "@pop"],
              [/#.*/, "comment", "@popall"],
            ],
            parameters: [
              [/\$\d+/, "variable.predefined"],
              [/\$\w+/, "variable"],
              [/\$[*@#?\-$!0_]/, "variable"],
              [/\$'/, "variable", "@parameterBodyQuote"],
              [/\$"/, "variable", "@parameterBodyDoubleQuote"],
              [/\$\(/, "variable", "@parameterBodyParen"],
              [/\$\{/, "variable", "@parameterBodyCurlyBrace"],
            ],
            parameterBodyQuote: [
              [/[^#:%*@\-!_']+/, "variable"],
              [/[#:%*@\-!_]/, "delimiter"],
              [/[']/, "variable", "@pop"],
            ],
            parameterBodyDoubleQuote: [
              [/[^#:%*@\-!_"]+/, "variable"],
              [/[#:%*@\-!_]/, "delimiter"],
              [/["]/, "variable", "@pop"],
            ],
            parameterBodyParen: [
              [/[^#:%*@\-!_)]+/, "variable"],
              [/[#:%*@\-!_]/, "delimiter"],
              [/[)]/, "variable", "@pop"],
            ],
            parameterBodyCurlyBrace: [
              [/[^#:%*@\-!_}]+/, "variable"],
              [/[#:%*@\-!_]/, "delimiter"],
              [/[}]/, "variable", "@pop"],
            ],
          },
        });

        // Define a new theme that contains only rules that match this language
        monaco.editor.defineTheme("vs-dark-dokku", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "custom-dokku", foreground: "07cbcf" },
            {
              token: "custom-dokku-options-left",
              foreground: "78909C",
              fontStyle: "bold",
            },
            {
              token: "custom-dokku-options-right",
              foreground: "B0BEC5",
              fontStyle: "bold",
            },
            {
              token: "custom-dokku-options-appname",
              foreground: "AFB42B",
              fontStyle: "bold",
            },
            { token: "custom-dokku-options-argument", foreground: "757575" },
          ],
        });

        // Register a completion item provider for the new language
        monaco.languages.registerCompletionItemProvider("dokku", {
          triggerCharacters: [":", " "],
          provideCompletionItems: (model, position) => {
            let suggestions = [];
            const textUntilPosition = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });
            // Suggest dokku if it's the first character of the line
            if (position.column <= 2) {
              suggestions.push({
                label: "dokku",
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: "dokku ${1:command}:${2:option} $0",
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              });
            }
            // check if we already inserted a dokku command and we need to suggest options
            const commandOptions = textUntilPosition.match(
              /^dokku\s+(?<command>[\w-]+):/
            );
            if (commandOptions) {
              //console.log(commandOptions.command);
            } else if (textUntilPosition.match(/^dokku\s+/)) {
              // suggest all the known dokku commands
              _.each(dokkuCommands, (command) =>
                suggestions.push({
                  label: command.name,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: command.name,
                  documentation: command.documentation,
                })
              );
            }
            return { suggestions: suggestions };
          },
        });
      }
    },
  },
  components: { MonacoEditor },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.card {
  border-top-right-radius: 23px;
  border-top-left-radius: 23px;
}
.card-header:first-child {
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}
.is-xsmall {
  height: 0.6rem;
  width: 0.6rem;
}
.text-white {
  color: #ffffff;
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
  height: 25px;
  margin-right: 5px;
}
/deep/.tag.is-ports {
  background-color: #546e7a;
  color: #fff;
}
/deep/.tag.is-environment {
  background-color: #00838f;
  color: #fff;
}
/deep/.tag.is-volume {
  background-color: #ad1457;
  color: #fff;
}
/deep/.tag.is-domain {
  background-color: #757575;
  color: #fff;
}
/deep/.tag.is-repository {
  background-color: #6d4c41;
  color: #fff;
}
/deep/.tag.is-image {
  background-color: #0288d1;
  color: #fff;
}
</style>
