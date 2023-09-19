import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../..";

export const addOrganization = createAction({
    auth: pipedriveAuth,
        name: 'add_organization',
        displayName: "Add An Organization",
        description: "Adds a new organization",
        props: {
            name: Property.ShortText({
                displayName: "Name",
                description: "The name of the organization",
                required: true,
            }),
            owner_id: Property.Dropdown<string>({
                displayName: "Owner",
                refreshers: [],
                description: "The ID of the user who will be marked as the owner of this organization",
                required: false,
                options: async ({ auth }) => {
                    if (!auth) {
                        return {
                            disabled: true,
                            options: [],
                            placeholder: "Connect your account"
                        }
                    }
                    const authProp: OAuth2PropertyValue = auth as OAuth2PropertyValue;
                    const users = (await getUsers(authProp)).users;
                    return {
                        disabled: false,
                        options: users.map(u => {
                            return {
                                label: u.name,
                                value: u.id
                            }
                        })
                    };
                }
            })
        },
        async run(context) {
            const configsWithoutAuthentication = { 
                name: context.propsValue.name,
                owner_id: context.propsValue.owner_id
            };

            const request: HttpRequest = {
                method: HttpMethod.POST,
                url: `${context.auth.data['api_domain']}/api/v1/organizations`,
                body: configsWithoutAuthentication,
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
        },
});
async function getUsers(authProp: OAuth2PropertyValue): Promise<{ users: PipedriveUser[] }> {
    const request: HttpRequest = {
        method: HttpMethod.GET,
        url: `${authProp.data['api_domain']}/api/v1/users`,
        authentication: {
            type: AuthenticationType.BEARER_TOKEN,
            token: authProp.access_token,
        },
        queryParams: {},
    };

    const result = await httpClient.sendRequest(request);

    return {
        users: result.body['success'] && result.body['data'] != null ? result.body['data'] : <PipedriveUser[]>[]
    };
}

interface PipedriveUser {
    id: string;
    name: string;
}