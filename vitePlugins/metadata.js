import fs from 'fs';

export default function metadata(data) {
    return {
        name: 'thetree-metadata',
        closeBundle() {
            fs.writeFileSync('./dist/metadata.json', JSON.stringify(data, null, 2))
        }
    }
}