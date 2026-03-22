import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import {
  CropName,
  VALID_CROP_NAMES,
} from "../../../domain/value-objects/crop-name";
import { Document } from "../../../domain/value-objects/document";
import { HarvestYear } from "../../../domain/value-objects/harvest-year";
import { StateCode } from "../../../domain/value-objects/state-code";

@ValidatorConstraint({ name: "IsValidDocument", async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "string" || value.trim().length === 0) {
      return false;
    }

    try {
      Document.create(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return "document deve ser um CPF ou CNPJ válido";
  }
}

@ValidatorConstraint({ name: "IsValidStateCode", async: false })
export class IsValidStateCodeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "string" || value.trim().length === 0) {
      return false;
    }

    try {
      StateCode.create(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return "state deve ser uma sigla de estado brasileira válida";
  }
}

@ValidatorConstraint({ name: "IsValidHarvestYear", async: false })
export class IsValidHarvestYearConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "string" || value.trim().length === 0) {
      return false;
    }

    try {
      HarvestYear.create(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'year deve seguir o formato AAAA/AAAA, como "2024/2025"';
  }
}

@ValidatorConstraint({ name: "IsValidCropName", async: false })
export class IsValidCropNameConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== "string" || value.trim().length === 0) {
      return false;
    }

    try {
      CropName.create(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return `name deve ser uma cultura válida: ${VALID_CROP_NAMES.join(", ")}`;
  }
}

@ValidatorConstraint({ name: "FarmAreaConsistency", async: false })
export class FarmAreaConsistencyConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const farm = args.object as {
      totalArea?: unknown;
      agriculturalArea?: unknown;
      vegetationArea?: unknown;
    };

    const totalArea = Number(farm.totalArea);
    const agriculturalArea = Number(farm.agriculturalArea);
    const vegetationArea = Number(farm.vegetationArea);

    if (
      !Number.isFinite(totalArea) ||
      !Number.isFinite(agriculturalArea) ||
      !Number.isFinite(vegetationArea)
    ) {
      return false;
    }

    return agriculturalArea + vegetationArea <= totalArea;
  }

  defaultMessage(): string {
    return "a soma da área agricultável com a área de vegetação não pode ultrapassar a área total";
  }
}
