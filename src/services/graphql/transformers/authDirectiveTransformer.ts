// NOTE: 公式リファレンスをを参考に実装してみたが細かい制御を理解できていないので追々...

import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { AuthenticationError } from 'apollo-server-express'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

export default function authDirectiveTransformer(schema: GraphQLSchema) {
  const directiveName = 'auth'

  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0]

      if (directive) {
        const originalResolve = fieldConfig.resolve || defaultFieldResolver
        fieldConfig.resolve = async function (source, args, context, info) {
          if (context.currentUser === null) {
            throw new AuthenticationError('not authorized')
          }

          return originalResolve(source, args, context, info)
        }
        return fieldConfig
      }
    }
  })
}
