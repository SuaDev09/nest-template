// Logger function for application
export default function GeneralLogger(section, message, type) {
  const timestamp = new Date();
  console.log(
    `${timestamp.toISOString()}: ${type} in section ${section}: ${message}`,
  );
}
