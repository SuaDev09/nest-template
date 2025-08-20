import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

export default class FileHandlerHelper {
  static ALLOWED_EXTENSIONS = ['pdf']; // Define allowed file extensions as a constant

  /**
   * Helper function to determine the destination path for file uploads.
   * Ensures the directory exists before returning the path.
   *
   * @param req - The request object.
   * @param file - The uploaded file object.
   * @param cb - The callback function.
   */
  static getDestinationPath = (
    req: any,
    file: any,
    cb: (error: Error | null, destinationPath: string | null) => void,
  ): void => {
    try {
      const destinationPath =
        '\\\\MEXGXYENGDEV01\\ultron\\nest-project-request-files';

      // Ensure the directory exists
      if (!existsSync(destinationPath)) {
        mkdirSync(destinationPath, { recursive: true });
      }

      cb(null, destinationPath);
    } catch (error) {
      console.error('Error setting file destination:', error); // Debugging log
      cb(new BadRequestException('Error setting file destination.'), null);
    }
  };

  /**
   * Helper function to generate a unique file name for the uploaded file.
   * Validates the file extension and constructs the file name.
   *
   * @param req - The request object.
   * @param file - The uploaded file object.
   * @param cb - The callback function.
   */
  static generateFileName = (
    req: { body: { Project_Name: string } },
    file: { originalname: string },
    cb: (error: Error | null, fileName: string | null) => void,
  ): void => {
    try {
      const fileName = req.body.Project_Name.replace(/ /g, '_');
      const originalNameSplit = file.originalname.split('.');
      const partialName = originalNameSplit[0].replace(/ /g, '_');
      const fileExtension = originalNameSplit[originalNameSplit.length - 1];

      // Validate file extension
      if (!this.ALLOWED_EXTENSIONS.includes(fileExtension.toLowerCase())) {
        console.error('Invalid file type:', fileExtension); // Debugging log
        return cb(
          new BadRequestException(
            'Invalid file type. Only PDF files are allowed.',
          ),
          null,
        );
      }

      const date = new Date();
      const fileDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const fileNameToSave = `${fileName}__${fileDate}__${partialName}.${fileExtension}`;

      cb(null, fileNameToSave);
    } catch (error) {
      console.error('Error generating file name:', error); // Debugging log
      cb(new BadRequestException('Error generating file name.'), null);
    }
  };

  /**
   * Deletes the uploaded file if an error occurs during processing.
   *
   * @param file - The uploaded file object.
   */
  static deleteFileOnError(file: any): void {
    if (file && file.path) {
      try {
        unlinkSync(file.path);
      } catch (deleteError) {
        console.error('Error deleting file:', deleteError); // Debugging log
      }
    }
  }
}
