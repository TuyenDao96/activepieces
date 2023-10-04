import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const updateDeal = createAction({
    auth: pipedriveAuth,
        name: 'update_deal',
        displayName: "Update A Deal",
        description: "Updates the properties of a deal",
        props: {
            id: Property.ShortText({
                displayName: 'Id',
                description: 'The ID of the deal',
                required: true,
            }),
            jira_ticket_id: Property.ShortText({
                displayName: "Jira Ticket ID",
                description: undefined,
                required: false,
            }),
            implement_status: Property.ShortText({
                displayName: "Implement Status",
                description: undefined,
                required: false,
            }),
        },
        async run(context) {
            const configsWithoutAuthentication = { 
                "8b78f5bea0c2fccf828ae1ae575b26fe5f363375": context.propsValue.jira_ticket_id,
                "c7647863587a3d4f40dbb8dd57a23c2a56d4e5ed": context.propsValue.implement_status
            };
            const payload = removeEmptyAndBlankProperties(configsWithoutAuthentication);

            const request: HttpRequest = {
                method: HttpMethod.PUT,
                url: `${context.auth.data['api_domain']}/api/v1/deals/${context.propsValue.id}`,
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