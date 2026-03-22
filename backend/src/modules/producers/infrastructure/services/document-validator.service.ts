import { Injectable } from "@nestjs/common";
import { DocumentValidator } from "../../domain/services/document-validator";
import { Document } from "../../domain/value-objects/document";

@Injectable()
export class DocumentValidatorService implements DocumentValidator {
  validate(raw: string): boolean {
    try {
      Document.create(raw);
      return true;
    } catch {
      return false;
    }
  }
}
