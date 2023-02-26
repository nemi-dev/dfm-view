import fs from 'fs'
import glob from 'glob'
import { resolve } from 'path'

let s = glob.sync("./public/img/**/*.png")
for (const a of s) {
  if (a != a.normalize()) {
    console.log('!!')
    fs.renameSync(a, a.normalize())
  }
}
