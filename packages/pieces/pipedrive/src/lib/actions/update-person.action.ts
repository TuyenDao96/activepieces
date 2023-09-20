import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const updatePerson = createAction({
    auth: pipedriveAuth,
        name: 'update_person',
        displayName: "Update Person",
        description: "Updates the properties of a person",
        props: {
            id: Property.Number({
                displayName: 'Id',
                description: 'The ID of the person',
                required: true,
            }),
            name: Property.ShortText({
                displayName: 'Name',
                description: undefined,
                required: false,
            }),
            first_name: Property.ShortText({
                displayName: 'First Name',
                description: undefined,
                required: false,
            }),
            last_name: Property.ShortText({
                displayName: 'Last Name',
                description: undefined,
                required: false,
            }),
            org_id: Property.Number({
                displayName: 'Organization',
                description: 'The ID of the organization this person will belong to',
                required: false,
            }),
            phone: Property.Json({
                displayName: 'Phone',
                description: 'Enter JSON data',
                required: false,
            }),
            account_type: Property.ShortText({
                displayName: 'Account Type',
                description: undefined,
                required: false,
            }),
            birth_day: Property.ShortText({
                displayName: 'Birth Day',
                description: undefined,
                required: false,
            }),
            gender: Property.ShortText({
                displayName: 'Gender',
                description: undefined,
                required: false,
            }),
            facebook_account: Property.ShortText({
                displayName: 'Facebook Account',
                description: undefined,
                required: false,
            }),
            zalo_account: Property.ShortText({
                displayName: 'Zalo Account',
                description: undefined,
                required: false,
            }),
            google_account: Property.ShortText({
                displayName: 'Google Account',
                description: undefined,
                required: false,
            }),
            country: Property.ShortText({
                displayName: 'Country',
                description: undefined,
                required: false,
            }),
            label: Property.StaticDropdown({
                displayName: 'Label',
                description: undefined,
                required: false,
                options: {
                    options: [
                        {
                            label: 'Customer',
                            value: 5
                        },
                        {
                            label: 'Hot lead',
                            value: 6
                        },
                        {
                            label: 'Warm lead',
                            value: 7
                        },
                        {
                            label: 'Cold lead',
                            value: 8
                        },
                        {
                            label: 'Nutrition',
                            value: 264
                        },
                        {
                            label: 'sign up',
                            value: 265
                        },
                        {
                            label: 'Delete From Org',
                            value: 314
                        }
                    ]
                }
            })
        },
        async run(context) {
            const configsWithoutAuthentication = { 
                name: context.propsValue.name,
                first_name: context.propsValue.first_name,
                last_name: context.propsValue.last_name,
                org_id: context.propsValue.org_id,
                phone: context.propsValue.phone,
                label: context.propsValue.label,
                "faacbc74aff25ca6e8521d3095e550c2e323cb77": context.propsValue.birth_day != null ? new Date(context.propsValue.birth_day) : null,
                "b9af84df5e8e40ae21587b8f1fa17c22baf441b0": context.propsValue.account_type,
                "4e58b6239d38fbbc5260d5f55587a8a4d486c4b4": context.propsValue.gender,
                "3fa02e82867c521810ec08427b7381164c6c2ea6": context.propsValue.facebook_account,
                "5ebaeac59aa3042da9364cc789ca775efe5241e3": context.propsValue.zalo_account,
                "c6e88ba97483902c66ed48f68441a39a8b3305b3": context.propsValue.country,
                "e5c52ce296170ed25f8ea6af10638d63e31f6651": context.propsValue.google_account
            };
            const payload = removeEmptyAndBlankProperties(configsWithoutAuthentication);

            const request: HttpRequest = {
                method: HttpMethod.PUT,
                url: `${context.auth.data['api_domain']}/api/v1/persons/${context.propsValue.id}`,
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

function removeEmptyAndBlankProperties(obj: Record<string, any>): Record<string, any> {
    for (const prop in obj) {
      if (obj[prop] === null || obj[prop] === undefined || obj[prop] === "") {
        delete obj[prop];
      }
    }
    return obj;
}