import fs from 'fs'
import path from 'path'

export default function metadata(data, path) {
    return {
        name: 'thetree-metadata',
        closeBundle() {
            fs.writeFileSync(path.join(path, 'metadata.json'), JSON.stringify(data, null, 2))
        }
    }
}