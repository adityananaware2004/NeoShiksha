const { generateSampleData } = require('./sampleData');

// Run the sample data generation
generateSampleData()
  .then(() => {
    console.log('Sample data generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running sample data generation:', error);
    process.exit(1);
  }); 