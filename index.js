const licenser = require('@wbmnky/license-report-generator');
const compare_versions = require("compare-versions");
const markup = require("markup-js");
const fs = require("fs");
const config = require("./config");
const template = fs.readFileSync(config.template_file).toString();

(async ()=> {
    let master_licence_text = '';
    let unique_summary = {};

    let rep = await licenser.reporter.generate({packagePath: config.project_path, depth: 100, useDevDependencies:false});
    let entries = rep.plain();
    entries.licenses.forEach(entry=>{
        let dependency_name = entry.name;
        let dependency_version = entry.version;
        let license_text = (entry.licenseSources && entry.licenseSources.license && Array.isArray(entry.licenseSources.license.sources) && entry.licenseSources.license.sources.length > 0) ? entry.licenseSources.license.sources[0].text : '';
        try {
            if (!unique_summary[dependency_name] || (unique_summary[dependency_name] && compare_versions(dependency_version, unique_summary[dependency_name].version) > 0)) {
                unique_summary[dependency_name] = {
                    dependency_name: dependency_name,
                    version: dependency_version,
                    repository: entry.repository && entry.repository.url ? entry.repository.url.replace('git+', '') : '',
                    license_type: entry.license,
                    license_text: license_text
                };
            }
        } catch(e){
            console.error(e);
        }
    });

    Object.values(unique_summary).forEach((dependency)=>{
        //we don't want to list harperdb because it's ours!
        if(dependency.dependency_name !== 'harperdb'){
            master_licence_text += markup.up(template, dependency);
        }

    });

    fs.writeFileSync(config.output_file, master_licence_text);
})();