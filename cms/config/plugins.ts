export default () => ({
  // Disable the guided tour plugin to fix the tours error
  'admin': {
    enabled: true,
    config: {
      features: {
        guidedTour: false,
      },
    },
  },
});
