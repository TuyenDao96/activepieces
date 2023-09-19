import { PieceAuth, createPiece } from '@activepieces/pieces-framework';
import { addPerson } from './lib/actions/add-person.action/add-person.action'
import { addLead } from './lib/actions/add-lead.action'
import { updatePerson } from './lib/actions/update-person.action'
import { addOrganization } from './lib/actions/add-organization.action'
import { newPerson } from './lib/trigger/new-person'
import { newDeal } from './lib/trigger/new-deal'
import { newActivity } from './lib/trigger/new-activity'
import { updatedPerson } from './lib/trigger/updated-person'
import { updatedDeal } from './lib/trigger/updated-deal'
import { getDetailLead } from './lib/actions/get-detail-lead.action'
import { getDetailPerson } from './lib/actions/get-detail-person.action'
import { searchLead } from './lib/actions/search-lead.action'
import { searchPerson } from './lib/actions/search-person.action'
import { updateLead } from './lib/actions/update-lead.action'

export const pipedriveAuth = PieceAuth.OAuth2({
    description: "",
    
    authUrl: "https://oauth.pipedrive.com/oauth/authorize",
    tokenUrl: "https://oauth.pipedrive.com/oauth/token",
    required: true,
    scope: ["admin", "contacts:full", "users:read"]
})

export const pipedrive = createPiece({
	displayName: "Ichiba Pipedrive",
	    minimumSupportedRelease: '0.5.0',
    logoUrl: 'https://cdn.activepieces.com/pieces/pipedrive.png',
    auth: pipedriveAuth,
	actions: [addPerson, updatePerson, searchPerson, getDetailPerson, addOrganization, addLead, updateLead, searchLead, getDetailLead],
	authors: ['ashrafsamhouri', 'tuyendv'],
	triggers: [newPerson, newDeal, newActivity, updatedPerson, updatedDeal],
});
