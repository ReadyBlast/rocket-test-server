export interface ILeadResponse {
  _page: number;
  _links: ILinks;
  _embedded: ILeadResponseEmbedded;
}

export interface ILeadResponseEmbedded {
  leads: ILead[];
}

export interface ILead {
  id: number;
  name: string;
  price: number;
  responsible_user_id: number;
  group_id: number;
  status_id: number;
  pipeline_id: number;
  loss_reason_id: number;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  closed_at: Date;
  closest_task_at: Date;
  is_deleted: boolean;
  // custom_fields_values: unknown | null;
  score: number | null;
  account_id: number;
  labor_cost: number;
  _links: ILinks;
  _embedded: ILeadEmbedded;
}

export interface ILeadEmbedded {
  tags: ITag[];
  companies: ICompany[];
  contacts: IContact[];
}

export interface ICompany {
  id: number;
  _links: ILinks;
}

export interface ILinks {
  self: ISelf;
}

export interface ISelf {
  href: string;
}

export interface ITag {
  id: number;
  name: string;
  color: string | null;
}

export interface IContact {
  id: number;
  is_main: boolean;
  links: ILinks;
}

export interface IStatus {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string;
  type: number;
  account_id: number;
  _links: ILinks;
}

export interface IPipeline {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  is_archive: boolean;
  account_id: number;
  _links: ILinks;
  _embedded: IPipelineInfo;
}

export interface IPipelineInfo {
  statuses: IStatus[];
}

export interface IContactInfo {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  responsible_user_id: number;
  group_id: number;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  closest_task_at: null;
  custom_fields_values: IContactCustomFieldsValue[];
  account_id: number;
  _links: ILinks;
  _embedded: IContactEmbedded;
}

export interface IContactEmbedded {
  leads: IContactCompany[];
  customers: IContactCompany[];
  companies: IContactCompany[];
}

export interface IContactCompany {
  id: number;
  _links: ILinks;
}

export interface IContactCustomFieldsValue {
  field_id: number;
  field_name: string;
  field_code: string;
  field_type: string;
  values: IContactExtendedValue[];
}

export interface IContactExtendedValue {
  value: string;
  enum_id: number;
  enum: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  lang: string;
}

export type THandledReturnData = {
  id: number;
  leadName: string;
  price: number;
  updatedAt: Date;
  responsibleUserName: string;
  responsibleUserEmail: string;
  pipelineName: string;
  statusName: string | undefined;
  statusColor: string;
  contacts: TContactInfo[];
};

export type TContactInfo = {
  contactFullName: string;
};
