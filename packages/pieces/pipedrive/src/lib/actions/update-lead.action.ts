import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const updateLead = createAction({
    auth: pipedriveAuth,
        name: 'update_lead',
        displayName: "Update A Lead",
        description: "Updates one or more properties of a lead",
        props: {
            id: Property.ShortText({
                displayName: 'Id',
                description: 'The ID of the lead',
                required: true,
            }),
            title: Property.ShortText({
                displayName: "Title",
                description: "The name of the lead",
                required: false,
            }),
            label_ids: Property.MultiSelectDropdown<string>({
                displayName: 'Labels',
                description: 'Select one or more labels',
                required: false,
                refreshers: ['auth'],
                options: async ({ auth }) => {
                    if (!auth) {
                        return {
                            disabled: true,
                            options: [],
                            placeholder: "Connect your account"
                        }
                    }
                    const authProp: OAuth2PropertyValue = auth as OAuth2PropertyValue;
                    const leadLabels = (await getLeadLabels(authProp)).leadLabels;
                    return {
                        disabled: false,
                        options: leadLabels.map(u => {
                            return {
                                label: u.name,
                                value: u.id
                            }
                        })
                    };
                }
            }),
            person_id: Property.Number({
                displayName: 'Person ID',
                description: 'The ID of a person which this lead will be linked to',
                required: false,
            }),
            organization_id: Property.Number({
                displayName: 'Organization',
                description: 'The ID of an organization which this lead will be linked to',
                required: false,
            }),            
            company_country: Property.ShortText({
                displayName: "Company Country",
                description: undefined,
                required: false,
            }),
            company_address: Property.ShortText({
                displayName: "Company Address",
                description: undefined,
                required: false,
            }),
            company_name: Property.ShortText({
                displayName: "Company Name",
                description: undefined,
                required: false,
            }),
            company_type: Property.ShortText({
                displayName: "Company Type",
                description: undefined,
                required: false,
            }),
            company_size: Property.ShortText({
                displayName: "Company Size",
                description: undefined,
                required: false,
            }),
            company_phone_number: Property.ShortText({
                displayName: "Company Phone Number",
                description: undefined,
                required: false,
            }),
            no_application: Property.Number({
                displayName: "No. Applications",
                description: undefined,
                required: false,
            }),
            product_interest: Property.ShortText({
                displayName: "Product Interest",
                description: undefined,
                required: false,
            }),
        },
        async run(context) {
            const configsWithoutAuthentication = { 
                title: context.propsValue.title,
                label_ids: context.propsValue.label_ids,
                person_id: context.propsValue.person_id,
                organization_id: context.propsValue.organization_id,
                "ad95e4887bb6303932fa5ee04a7e556a4b606a86_country": context.propsValue.company_country,
                "ad95e4887bb6303932fa5ee04a7e556a4b606a86": context.propsValue.company_address,
                "79a573e5ff68bcd4b1ebae42f3d56aad83be3291": context.propsValue.company_name,
                "d81982fd09aecc7be701d7553364dc35b4b7c16b": context.propsValue.company_type,
                "a3772ae131698fadec89eb88b345f26aff7b5fc7": context.propsValue.company_size,
                "27f2a8e17f2f551bbbccedc93ed711657f247eee": context.propsValue.company_phone_number,
                "2802adb4d31cd05ae4fc112979fb965f06fcdcd2": context.propsValue.no_application,
                "e09b19c024eb9711fbc84af5ca94e93e30428af8": context.propsValue.product_interest
            };
            const payload = removeEmptyAndBlankProperties(configsWithoutAuthentication);

            const request: HttpRequest = {
                method: HttpMethod.PATCH,
                url: `${context.auth.data['api_domain']}/api/v1/leads/${context.propsValue.id}`,
                body: payload,
                authentication: {
                    type: AuthenticationType.BEARER_TOKEN,
                    token: context.auth.access_token,
                },
                queryParams: {},
            };

            const result = await httpClient.sendRequest(request);

            if (result.body?.['success']) {
                return result.body?.["data"];
            } else {
                return result;
            }
        }
});

async function getLeadLabels(authProp: OAuth2PropertyValue): Promise<{ leadLabels: PipedriveLeadLabel[] }> {
    const request: HttpRequest = {
        method: HttpMethod.GET,
        url: `${authProp.data['api_domain']}/api/v1/leadLabels`,
        authentication: {
            type: AuthenticationType.BEARER_TOKEN,
            token: authProp.access_token,
        },
        queryParams: {},
    };

    const result = await httpClient.sendRequest(request);

    return {
        leadLabels: result.body['success'] && result.body['data'] != null ? result.body['data'] : <PipedriveLeadLabel[]>[]
    };
}

interface PipedriveLeadLabel {
    id: string;
    name: string;
}

function removeEmptyAndBlankProperties(obj: Record<string, any>): Record<string, any> {
    for (const prop in obj) {
      if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
        delete obj[prop];
      }
    }
    return obj;
}