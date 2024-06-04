import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AMOCRM_URL } from './amocrm.constants';
import {
  IContact,
  IContactCustomFieldsValue,
  IContactExtendedValue,
  IContactInfo,
  ILead,
  ILeadResponse,
  IPipeline,
  IStatus,
  IUser,
  TContactInfo,
  THandledReturnData,
} from './amocrm.model';

@Injectable()
export class AmoСrmService {
  private token: string;
  private subdomain: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.token = this.configService.get('AMOCRM_TOKEN') ?? '';
    this.subdomain = this.configService.get('AMOCRM_SUBDOMAIN') ?? '';
  }

  // Делаеи запрос к AmoCRM API
  async getLeads(query?: string): Promise<THandledReturnData[]> {
    const leadsData = await this.getDataFromAmoCrmApi<ILeadResponse>(
      AMOCRM_URL.leads,
      '',
      query,
    );

    // AmoCRM может вернуть запрос с кодом 204, проверяем наличие свойств в объекте ответа
    if (Object.keys(leadsData).length > 0) {
      const handledData = await this.getDetailedInfoParser(leadsData);

      return handledData;
    }

    return [];
  }

  // Получаем данные из массива Leads и обрабатываем под нужный нам выходной тип
  private async getDetailedInfoParser(
    leadsData: ILeadResponse,
  ): Promise<THandledReturnData[]> {
    return Promise.all(
      leadsData!._embedded.leads.map(
        async (lead: ILead): Promise<THandledReturnData> => {
          const contacts = await Promise.all(
            lead._embedded.contacts.map(
              async (contact: IContact): Promise<TContactInfo> => {
                const contactDetailedInfo =
                  await this.getDataFromAmoCrmApi<IContactInfo>(
                    AMOCRM_URL.contacts,
                    String(contact.id),
                  );

                if (contactDetailedInfo === null) {
                  return {
                    contactFullName: '',
                  };
                }
                const contactValues =
                  contactDetailedInfo.custom_fields_values.reduce(
                    (
                      prevValue: { [key: string]: IContactExtendedValue[] },
                      currentValue: IContactCustomFieldsValue,
                    ) => {
                      return {
                        ...prevValue,
                        [currentValue.field_code]: currentValue.values,
                      };
                    },
                    {},
                  );

                return {
                  contactFullName: contactDetailedInfo.name,
                  ...contactValues,
                };
              },
            ),
          );

          const responsibleUserInfo = await this.getDataFromAmoCrmApi<IUser>(
            AMOCRM_URL.users,
            String(lead.responsible_user_id),
          );

          const pipelineInfo = await this.getDataFromAmoCrmApi<IPipeline>(
            AMOCRM_URL.pipelines,
            String(lead.pipeline_id),
          );

          const statusName = pipelineInfo._embedded.statuses.find(
            (status: IStatus): boolean => status.id === lead.status_id,
          );

          const statusColor = pipelineInfo._embedded.statuses.find(
            (status: IStatus): boolean => status.id === lead.status_id,
          )!;

          const result = {
            id: lead.id,
            leadName: lead.name,
            price: lead.price,
            updatedAt: lead.updated_at,
            responsibleUserName: responsibleUserInfo.name,
            responsibleUserEmail: responsibleUserInfo.email,
            pipelineName: pipelineInfo.name,
            statusName: statusName ? statusName.name : '',
            statusColor: statusColor ? statusColor.color : '',
            contacts: contacts,
          };

          return result;
        },
      ),
    );
  }

  // Функция запроса данных типа Т из AmoCRM API
  private async getDataFromAmoCrmApi<T>(
    endpointUrl: string,
    id: string,
    queryParams?: string,
  ): Promise<T> {
    const query = queryParams;

    const { data } = await firstValueFrom(
      this.httpService
        .get<T>('https://' + this.subdomain + endpointUrl + id, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'User-Agent': 'amoCRM-oAuth-client/1.0',
          },
          params: {
            query,
            with: 'contacts',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error.response);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }
}
