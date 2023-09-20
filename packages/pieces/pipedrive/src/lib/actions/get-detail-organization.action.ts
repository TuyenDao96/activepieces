import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const getDetailOrganization = createAction({
    auth: pipedriveAuth,
        name: 'get_detail_organization',
        displayName: "Get Details Of An Organization",
        description: "Returns the details of an organization",
        props: {
            id: Property.ShortText({
                displayName: 'Id',
                description: 'The ID of the organization',
                required: true,
            })
        },
        async run(context) {
            const request: HttpRequest = {
                method: HttpMethod.GET,
                url: `${context.auth.data['api_domain']}/api/v1/organizations/${context.propsValue.id}`,
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