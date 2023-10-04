import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const getDetailDeal = createAction({
    auth: pipedriveAuth,
        name: 'get_detail_deal',
        displayName: "Get Details Of A Deal",
        description: "Returns the details of a specific deal",
        props: {
            id: Property.ShortText({
                displayName: 'Id',
                description: 'The ID of the deal',
                required: true,
            })
        },
        async run(context) {
            const request: HttpRequest = {
                method: HttpMethod.GET,
                url: `${context.auth.data['api_domain']}/api/v1/deals/${context.propsValue.id}`,
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