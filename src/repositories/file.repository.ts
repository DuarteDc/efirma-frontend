import { toast } from "sonner";

import { Http } from "@/libs/http/http";
import { efirmaApiInstance } from "@/libs/http/conf";

export class FileRepository extends Http {
  constructor() {
    super(efirmaApiInstance);
  }

  async uploadFile(uploadFile: string) {
    try {
      const file = await this.post("/api/v1/document/upload", { uploadFile });
      console.log(file);
    } catch (error) {
      toast.error(error as string);
    }
  }
}
