# harperdb_open_source_license_generator
This project iterates the a package.json and creates an attribution list for every dependency in the project

## Inputs

### project_path

> `string` - defaults to current directory: '.'

The root path of the repo you want to generate a license file for. There should be a file named
`package.json` in this path.

### output_file

> `string` - defaults to license.md

The location and format of the license file. Currnetly, only the file extension `md` is currently supported.

## Example

```shell
project_path=${HOME}/src/harperdb/harperdb output_file=license.md node index.js
```