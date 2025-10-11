import API from './api';

/**
 * Uploads a new certificate with its metadata.
 * The FormData should contain the certificate file, hackathonName, and issuedAt.
 * @param {FormData} formData - The form data containing the file and metadata.
 * @returns {Promise<Object>} The newly created certificate object.
 */
export const uploadCertificate = async (formData) => {
  try {
    // Axios automatically sets the correct 'Content-Type: multipart/form-data' header
    // when you pass a FormData object.
    const { data } = await API.post('/api/certificates', formData);
    return data;
  } catch (error) {
    console.error("Error uploading certificate:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to upload certificate');
  }
};

/**
 * Fetches all certificates for the currently authenticated user.
 * @returns {Promise<Array>} An array of the user's certificate objects.
 */
export const getMyCertificates = async () => {
    try {
        const { data } = await API.get('/api/certificates');
        return data;
    } catch (error) {
        console.error("Error fetching certificates:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch certificates');
    }
};