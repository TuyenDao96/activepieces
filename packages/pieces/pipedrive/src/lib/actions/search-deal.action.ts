import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const searchDeal = createAction({
    auth: pipedriveAuth,
        name: 'search_deal',
        displayName: "Search Deals",
        description: "Searches all deals by title, notes and/or custom fields",
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
                defaultValue: 'custom_fields'
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
            person_id: Property.Number({
                displayName: 'Person',
                description: 'Will filter leads by the provided person ID',
                required: false,
            }),
            organization_id: Property.Number({
                displayName: 'Organization',
                description: 'The ID of the organization this person will belong to',
                required: false,
            }),
            status: Property.ShortText({
                displayName: 'Status',
                description: 'Will filter deals by the provided specific status. open = Open, won = Won, lost = Lost',
                required: false,
            }),
            include_fields: Property.ShortText({
                displayName: 'Include Fields',
                description: 'Supports including optional fields in the results which are not provided by default',
                required: false,
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
                person_id: context.propsValue.person_id,
                organization_id: context.propsValue.organization_id,
                status: context.propsValue.status,
                include_fields: context.propsValue.include_fields,
                start: context.propsValue.start,
                limit: context.propsValue.limit
            };
            const queryParams = removeEmptyAndBlankProperties(configsWithoutAuthentication);

            const request: HttpRequest = {
                method: HttpMethod.GET,
                url: `${context.auth.data['api_domain']}/api/v1/deals/search`,
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