
/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {number} age
 * @property {string} occupation
 * @property {string} phoneNumber
 * @property {ScamDetection[]} scamDetectionHistory
 * @property {string} createdAt
 * @property {string} updatedAt
 */


/**
 * @typedef {Object} ScamDetection
 * @property {string} _id
 * @property {string} content
 * @property {'scam' | 'safe' | 'suspicious'} result
 * @property {string} explanation
 * @property {'text' | 'image' | 'url' | 'phone'} sourceType
 * @property {string} date
 */


/**
 * @typedef {Object} ScamUpdate
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {'warning' | 'alert' | 'info'} type
 * @property {string} date
 */


/**
 * @typedef {Object} WatchlistEntry
 * @property {string} _id
 * @property {string} user
 * @property {string} value
 * @property {'phone' | 'email' | 'url'} type
 * @property {string} dateAdded
 */


/**
 * @typedef {Object} Analytics
 * @property {number} totalScams
 * @property {{ text: number, image: number, url: number, phone: number }} typeCount
 * @property {number} safetyScore
 */


/**
 * @typedef {Object} AuthState
 * @property {User | null} user
 * @property {string | null} accessToken
 * @property {string | null} refreshToken
 * @property {boolean} isAuthenticated
 * @property {boolean} loading
 * @property {string | null} error
 */


/**
 * @typedef {Object} ApiResponse
 * @property {any} [data]
 * @property {string} [message]
 * @property {string} [error]
 */


/**
 * @typedef {Object} LoginCredentials
 * @property {string} [phoneNumber]
 * @property {string} [email]
 * @property {string} password
 */


/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {number} age
 * @property {string} password
 * @property {string} occupation
 * @property {string} phoneNumber
 */


/**
 * @typedef {Object} ScamCheckResult
 * @property {'scam' | 'safe' | 'suspicious'} result
 * @property {string} explanation
 * @property {string} [extractedText]
 */


/**
 * @typedef {Object} ThemeState
 * @property {boolean} isDark
 */
