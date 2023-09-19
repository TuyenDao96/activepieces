import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const getDetailLead = createAction({
    auth: pipedriveAuth,
        name: 'get_detail_lead',
        displayName: "Get One Lead",
        description: "Returns details of a specific lead",
        props: {
            id: Property.ShortText({
                displayName: 'Id',
                description: 'The ID of the lead',
                required: true,
            })
        },
        async run(context) {
            const request: HttpRequest = {
                method: HttpMethod.GET,
                url: `${context.auth.data['api_domain']}/api/v1/leads/${context.propsValue.id}`,
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