module.exports = {
  root: true,
  extends: '@react-native',
  // want to disable the empty deps (exhaustive  deps) rule
  rules: {
    'react-hooks/exhaustive-deps': 'off',
  },
};
