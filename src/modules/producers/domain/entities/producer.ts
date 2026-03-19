import { Document } from "../value-objects/document";
import { Farm } from "./farm";

export interface ProducerProps {
  id: string;
  document: Document;
  name: string;
  farms?: Farm[];
}

export class Producer {
  public readonly id: string;
  public readonly document: Document;
  public readonly name: string;
  public readonly farms: Farm[];

  constructor(props: ProducerProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("O nome do produtor é obrigatório.");
    }

    this.id = props.id;
    this.document = props.document;
    this.name = props.name.trim();
    this.farms = props.farms ?? [];
  }

  addFarm(farm: Farm): Producer {
    return new Producer({
      id: this.id,
      document: this.document,
      name: this.name,
      farms: [...this.farms, farm],
    });
  }

  update(data: { name?: string; document?: Document }): Producer {
    return new Producer({
      id: this.id,
      document: data.document ?? this.document,
      name: data.name ?? this.name,
      farms: this.farms,
    });
  }
}
