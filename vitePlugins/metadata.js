import fs from 'fs'
import path from 'path'

export default function metadata(data) {
    return {
        name: 'thetree-metadata',
        closeBundle() {
            fs.writeFileSync(path.join(data.path, 'metadata.json'), JSON.stringify(data, null, 2))
        }
    }
}