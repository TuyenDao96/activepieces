import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const getDetailPerson = createAction({
    auth: pipedriveAuth,
        name: 'get_detail_person',
        displayName: "Get Details Of A Person",
        description: "Returns the details of a person",
        props: {
            id: Property.Number({
                displayName: 'Id',
                description: 'The ID of the person',
                required: true,
            })
        },
        async run(context) {
            const request: HttpRequest = {
                method: HttpMethod.GET,
                url: `${context.auth.data['api_domain']}/api/v1/persons/${context.propsValue.id}`,
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
