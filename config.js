let config = {
    project_path: process.env.project_path || '.',
    output_file: process.env.output_file || 'license.md',
    template_file: process.env.template_file || './template.txt'
};

module.exports = config;