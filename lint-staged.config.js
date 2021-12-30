module.exports = {
  'packages/**/*.{js,ts,json,d.ts}': files => {
    const match = files.filter(file => !file.includes('.js') && !file.includes('.json') && !file.includes('.pnp.cjs'))
    return [`eslint --cache --max-warnings 0 --fix ${match.join(' ')}`, `git add ${match.join(' ')}`]
  },
}
