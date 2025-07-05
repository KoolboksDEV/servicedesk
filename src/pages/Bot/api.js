const API_BASE_URL = 'https://sathservicedesk-sathservicedesk-staging-dpdaa2a3dkd7e7as.eastus2-01.azurewebsites.net/';




// Function to query the bot
export const queryBot = async (userInput, userName, userEmail, conversations_id, documentText) => {
    const body = JSON.stringify({ user: userInput, conversationId: conversations_id, document: documentText });
    const headers = {
        'Content-Type': 'application/json',
        'userEmail': userEmail,
        'userName': userName,
     };
    // Add conversationId only if it has a value
    if (conversations_id) {
        headers['conversationId'] = conversations_id;
    }
    return fetch(`${API_BASE_URL}/bot`, {
        method: 'POST',
        headers: headers,
        body 
    })
    .then(async (res) => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        } else {
            const textResponse = await res.text();
            console.error('Non-JSON response:', textResponse);
            return { error: 'Invalid response from server', details: textResponse };
        }
    })
    .catch((error) => {
        console.error('Error fetching bot response:', error);
        return { error: 'Fetch error', details: error };
    });
};


// Function to get all conversations
export const getAllConversations = async (userEmail) => {
    return fetch(`${API_BASE_URL}/conversations`, {
        method: 'GET',
        headers: { userEmail }
    }).then(res => res.json());
};

// Function to get a specific conversation
export const getConversation = async (conversationId, userEmail) => {
    return fetch(`${API_BASE_URL}/get-query/${conversationId}`, {
        method: 'GET',
        headers: { userEmail }
    }).then(res => res.json());
};

// Function to delete a conversation
export const deleteConversation = async (conversationId, userEmail) => {
    return fetch(`${API_BASE_URL}/delete-conversation/${conversationId}`, {
        method: 'DELETE',
        headers: { userEmail }
    }).then(res => res.json());
};
















