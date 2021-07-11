import MerchantAuthService from "@/services/merchant/authService";
import { GraphQLNonNull, GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

const authService = new MerchantAuthService()

const LoginMutation = new GraphQLObjectType({
    name: "LoginMutation",
    fields: {
        user: {
            type :new GraphQLObjectType({
            name: "UserLoginData",
            fields: {
                id: {type: GraphQLInt},
                email: {type: GraphQLString},
                firstName: {type: GraphQLString},
                lastName: {type: GraphQLString},
                phone: {type: GraphQLString},
                photoUrl: {type: GraphQLString}
            }})
        },
        token: {
            type: GraphQLString
        }
    }
})

const AuthMutation = new GraphQLObjectType({
    name: "AuthMutation",
    fields: {
        login: {
            description: "Credential filled by email / phone",
            type: LoginMutation,
            args: {
                credential: {type: GraphQLString},
                password: {type: GraphQLString}
            },
            resolve: async (_src, {credential, password}, ctx) => {
                try {
                    return await authService.login(credential, password);
                } catch (e) {
                    throw e;
                }
            }
        },
        register: {
            type: GraphQLBoolean,
            args: {
                email: {type: GraphQLNonNull(GraphQLString)},
                firstName: {type: GraphQLNonNull(GraphQLString)},
                lastName: {type: GraphQLString},
                password: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (_src, args) => {
                try {
                    return await authService.register(args);
                } catch (e) {
                    throw e;
                }
            }
        }
    },
})

export default {
    type: AuthMutation,
    resolve: () => true
};