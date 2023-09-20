import { createAction, Property, OAuth2PropertyValue } from "@activepieces/pieces-framework";
import { HttpRequest, HttpMethod, AuthenticationType, httpClient } from "@activepieces/pieces-common";
import { pipedriveAuth } from "../../..";

export const addPerson = createAction({
    auth: pipedriveAuth,
        name: 'add_person',
        displayName: "Add Person",
        description: "Add a new person to the account",
        props: {
            name: Property.ShortText({
                displayName: 'Name',
                description: undefined,
                required: true,
            }),
            owner_id: Property.Dropdown<string>({
                displayName: "Owner",
                refreshers: [],
                description: "The user who owns this Person's record",
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
            }),
            org_id: Property.Dropdown<string>({
                displayName: "Organization",
                refreshers: [],
                description: "The Org of this Person",
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
                    const orgs = (await getOrganizations(authProp)).orgs;
                    return {
                        disabled: false,
                        options: orgs.map(o => {
                            return {
                                label: o.name,
                                value: o.id
                            }
                        })
                    };
                }
            }),
            email: Property.ShortText({
                displayName: 'Email',
                description: undefined,
                required: false,
            }),
            phone: Property.ShortText({
                displayName: 'Phone',
                description: undefined,
                required: false,
            }),
            marketing_status: Property.StaticDropdown<string>({
                displayName: "Marketing Status",
                description: "Marketing opt-in status",
                required: false,
                options: {
                    disabled: false,
                    options: [
                        {
                            label: "No Consent",
                            value: "no_consent"
                        },
                        {
                            label: "Unsubscribed",
                            value: "unsubscribed"
                        },
                        {
                            label: "Subscribed",
                            value: "subscribed"
                        },
                        {
                            label: "Archived",
                            value: "archived"
                        }
                    ]
                }
            }),
            source: Property.StaticDropdown<string>({
                displayName: "Source",
                description: "Source",
                required: false,
                options: {
                    disabled: false,
                    options: [
                        {
                            label: "Contact Form",
                            value: "Contact Form"
                        },
                        {
                            label: "Org",
                            value: "Org"
                        },
                        {
                            label: "Linkedin",
                            value: "Linkedin"
                        }
                    ]
                }
            }),
            country: Property.ShortText({
                displayName: 'Country',
                description: undefined,
                required: false,
            }),
            account_type: Property.StaticDropdown({
                displayName: "Account Type",
                description: undefined,
                required: false,
                defaultValue: 271,
                options: {
                    disabled: false,
                    options: [
                        {
                            label: "Individual",
                            value: 271
                        },
                        {
                            label: "Business",
                            value: 272
                        }
                    ]
                }
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
        },
        async run(context) {
            const configsWithoutAuthentication = { 
                name: context.propsValue.name,
                owner_id: context.propsValue.owner_id,
                org_id: context.propsValue.org_id,
                phone: context.propsValue.phone,
                email: context.propsValue.email,
                marketing_status: context.propsValue.marketing_status,
                "df17db22d940960b43ba3f30b4d39e0f2e2bdff0": context.propsValue.source,
                "c6e88ba97483902c66ed48f68441a39a8b3305b3": context.propsValue.country,
                "b9af84df5e8e40ae21587b8f1fa17c22baf441b0": context.propsValue.account_type,
                "3fa02e82867c521810ec08427b7381164c6c2ea6": context.propsValue.facebook_account,
                "5ebaeac59aa3042da9364cc789ca775efe5241e3": context.propsValue.zalo_account,
                "e5c52ce296170ed25f8ea6af10638d63e31f6651": context.propsValue.google_account
            };

            const request: HttpRequest = {
                method: HttpMethod.POST,
                url: `${context.auth.data['api_domain']}/api/v1/persons`,
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

async function getOrganizations(authProp: OAuth2PropertyValue): Promise<{ orgs: PipedriveOrganization[] }> {
    const request: HttpRequest = {
        method: HttpMethod.GET,
        url: `${authProp.data['api_domain']}/api/v1/organizations`,
        authentication: {
            type: AuthenticationType.BEARER_TOKEN,
            token: authProp.access_token,
        },
        queryParams: {
            limit: "500" // max limit is 500 (API restriction)
        },
    };

    const result = await httpClient.sendRequest(request);

    return {
        orgs: result.body['success'] && result.body['data'] != null ? result.body['data'] : <PipedriveOrganization[]>[]
    };
}

interface PipedriveUser {
    id: string;
    name: string;
}

interface PipedriveOrganization {
    id: string;
    name: string;
}
