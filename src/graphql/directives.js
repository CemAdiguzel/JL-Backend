import {
  AuthenticationError,
  ForbiddenError,
  gql,
} from "apollo-server-express";
import { defaultFieldResolver } from "graphql/execution/execute";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { HIGH_GRADE_USER_ROLES } from "../entities/enums";

export const typeDefs = gql`
  directive @isAuthenticated on FIELD_DEFINITION
  directive @adminOnly on FIELD_DEFINITION | ARGUMENT_DEFINITION
`;

export function directiveTransformer(schema) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const adminOnlyDirective = getDirective(
        schema,
        fieldConfig,
        "adminOnly"
      )?.[0];

      const isAuthenticatedDirective = getDirective(
        schema,
        fieldConfig,
        "isAuthenticated"
      )?.[0];

      if (adminOnlyDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function calls
        // the original resolver
        fieldConfig.resolve = async function (source, args, context, info) {
          // THE FUNCTIONAL PART STARTS
          if (
            !context.user ||
            !HIGH_GRADE_USER_ROLES.includes(context.user.userRole)
          ) {
            throw new ForbiddenError("User is not authorized.");
          }
          return await resolve(source, args, context, info);
          // THE FUNCTIONAL PART ENDS
        };
      }

      if (isAuthenticatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function calls
        // the original resolver
        fieldConfig.resolve = async function (source, args, context, info) {
          // THE FUNCTIONAL PART STARTS
          return await resolve(source, args, context, info);
          // THE FUNCTIONAL PART ENDS
        };
      }

      return fieldConfig;
    },
  });
}
