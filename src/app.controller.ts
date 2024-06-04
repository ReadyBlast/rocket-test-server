import { Controller, Get, Query } from '@nestjs/common';
import { AmoСrmService } from './amocrm/amocrm.service';

@Controller('api')
export class AppController {
  constructor(private readonly amocrmService: AmoСrmService) {}

  @Get('leads')
  async getLeads(@Query('query') query: string) {
    if (!query || query.length < 3) {
      const leads = await this.amocrmService.getLeads();

      return leads;
    }

    const filteredLeads = await this.amocrmService.getLeads(query);
    return filteredLeads;
  }
}
