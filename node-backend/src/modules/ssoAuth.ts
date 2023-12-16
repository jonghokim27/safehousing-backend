/**
 * Module dependencies
 */

import axios from 'axios';

/**
 * SSO Provider Array
 */
export const ssoProviders: Array<string> = ["kakao"];

/**
 * Generate User Id containing SSO Provider identifier
 * @param {string} provider SSO Provider
 * @param {string} userId User Id from SSO Provider
 * @returns {string} New User Id
 */
export const genUserId = (provider: string, userId: string): string => {
    if(provider == "kakao"){
        return "K-" + userId;
    }
    return userId;
};

/**
 * Return type for ssoAuth function
 */
export interface SSOUserData{
    userId: string,
    email: string,
    nickname: string
};

/**
 * Validate SSO Token
 * @param {string} provider 
 * @param {string} token 
 * @returns {Promise(SSOUserData | false)} User data
 */
export default async (provider: string, token: string): Promise<SSOUserData | false> => {
    try{
        if(provider == "kakao"){
            let kakaoSSOResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {headers: {'Authorization': "Bearer " + token}});
            
            return {
                userId: kakaoSSOResponse.data.id,
                email: kakaoSSOResponse.data.kakao_account.email,
                nickname: kakaoSSOResponse.data.kakao_account.name
            }
        }
        else{
            return false;
        }
    }
    catch(e){
        return false;
    }
};