const legal = require('legal-eagle'),
    compare_versions = require('compare-versions'),
    markup = require('markup-js'),
    fs = require('fs'),
    config = require('./config');

//used to generate each package attribution format
const template = fs.readFileSync('./template.txt').toString();

legal({path:config.harperdb_project_path}, (err, summary)=>{
    let master_licence_text = '';

    if(err){
        console.error(err);
    }

    let unique_summary = {};
    Object.keys(summary).forEach((dependency_key)=>{
        let split_dependency = dependency_key.split('@');
        let dependency_name = split_dependency[0];
        let dependency_version = split_dependency[1];
        let dependency_object = summary[dependency_key];

        //creating a unique listing for each dependency, there are occaisions where there are multiple versions of a package
        //in thatt instance we compare the versions and use the most recent
        if(!unique_summary[dependency_name] || (unique_summary[dependency_name] && compare_versions(dependency_version, unique_summary[dependency_name].version) > 0)){
            unique_summary[dependency_name] = {
                dependency_name: dependency_name,
                version: dependency_version,
                repository: dependency_object.repository ? dependency_object.repository.replace('git+', '') : '',
                license_type: dependency_object.license,
                license_text: dependency_object.sourceText
            };
        }
    });

    Object.values(unique_summary).forEach((dependency)=>{
        //we don't want to list harperdb because it's ours!
        if(dependency.dependency_name !== 'harperdb'){
            master_licence_text += markup.up(template, dependency);
        }

    });

    fs.writeFileSync(config.output_file, master_licence_text);
});


