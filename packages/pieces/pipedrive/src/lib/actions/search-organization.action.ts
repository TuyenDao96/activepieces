import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const searchOrganization = createAction({
    auth: pipedriveAuth,
        name: 'search_organization',
        displayName: "Search Organizations",
        description: "Searches all organizations by name, address, notes and/or custom fields",
        props: {
            term: Property.ShortText({
                displayName: 'Term',
                description: 'The search term to look for. Minimum 2 characters (or 1 if using exact_match)',
                required: true,
            }),
            fields: Property.ShortText({
                displayName: 'Fields',
                description: 'A comma-separated string array. The fields to perform the search from. Defaults to all of them',
                required: false,
                defaultValue: 'name'
            }),
            exact_match: Property.StaticDropdown({
                displayName: 'Exact Match',
                description: 'When enabled, only full exact matches against the given term are returned. It is not case sensitive.',
                required: true,
                options: {
                    options: [
                        {
                            label: 'True',
                            value: true
                        },
                        {
                            label: 'False',
                            value: false
                        }
                    ]
                }
            }),
            start: Property.Number({
                displayName: 'Start',
                description: 'Pagination start',
                required: false,
                defaultValue: 0
            }),
            limit: Property.Number({
                displayName: 'Limit',
                description: 'Items shown per page',
                required: false,
                defaultValue: 10
            })
        },
        async run(context) {
            const configsWithoutAuthentication = { 
                term: context.propsValue.term,
                fields: context.propsValue.fields,
                exact_match: context.propsValue.exact_match,                
                start: context.propsValue.start,
                limit: context.propsValue.limit
            };
            const queryParams = removeEmptyAndBlankProperties(configsWithoutAuthentication);

            const request: HttpRequest = {
                method: HttpMethod.GET,
                url: `${context.auth.data['api_domain']}/api/v1/organizations/search`,
                authentication: {
                    type: AuthenticationType.BEARER_TOKEN,
                    token: context.auth.access_token,
                },
                queryParams: queryParams,
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