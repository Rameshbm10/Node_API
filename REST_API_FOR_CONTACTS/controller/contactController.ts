import { Request, Response, NextFunction } from 'express';
import joi, { ObjectSchema } from 'joi';
import connection from '../models/connection';
import CustomErrorHandler from '../services/CustomErrorHandler';

interface Contact {
  id: number;
  email: string;
  phoneNumber: string;
}

interface PrimaryContact {
  id: number;
  email: string;
  phoneNumber: string;
}

const contactController = {
  async create(req: Request, res: Response, next: NextFunction) {
    const requestPayloadSchema: ObjectSchema = joi.object({
      email: joi.string().email().required(),
      phoneNumber: joi.string(),
    });

    const { error } = requestPayloadSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const { email, phoneNumber } = req.body;

      // Find the primary contact
      const findPrimaryContactQuery = `
        SELECT * FROM Contact
        WHERE email = ? OR phoneNumber = ?
        ORDER BY linkPrecedence
        LIMIT 1
      `;

      connection.query(findPrimaryContactQuery, [email, phoneNumber], (error: any, results: Contact[]) => {
        if (error) {
          return next(new CustomErrorHandler(500, 'Error querying the database'));
        }

        if (results.length > 0) {
          const primaryContact: PrimaryContact = results[0];

          // Find secondary contacts linked to the primary contact
          const findSecondaryContactsQuery = `
            SELECT * FROM Contact
            WHERE linkedId = ?
          `;

          connection.query(findSecondaryContactsQuery, [primaryContact.id], (secondaryError: any, secondaryResults: Contact[]) => {
            if (secondaryError) {
              return next(new CustomErrorHandler(500, 'Error querying the database'));
            }

            // Consolidate emails and phoneNumbers
            const emails: string[] = [primaryContact.email];
            const phoneNumbers: string[] = [primaryContact.phoneNumber];
            const secondaryContactIds: number[] = secondaryResults.map((contact) => contact.id);

            // Return the consolidated contact information
            res.status(200).json({
              contact: {
                primaryContactId: primaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds,
              },
            });
          });
        } else {
          // Create a new primary contact if not found
          const newContact = {
            email,
            phoneNumber,
            linkedId: null,
            linkPrecedence: 'primary',
          };

          connection.query('INSERT INTO Contact SET ?', newContact, (insertError: any, insertResult: any) => {
            if (insertError) {
              return next(new CustomErrorHandler(500, 'Error inserting into the database'));
            }

            newContact.linkedId = insertResult.insertId;

            // Return the newly created primary contact
            res.status(200).json({
              contact: {
                primaryContactId: newContact.linkedId,
                emails: [newContact.email],
                phoneNumbers: [newContact.phoneNumber],
                secondaryContactIds: [],
              },
            });
          });
        }
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default contactController;
