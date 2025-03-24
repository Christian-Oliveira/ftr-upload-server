import { uploadImage } from '@/infra/app/services/upload-image'
import { isSuccess, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ url: z.string() }),
          400: z.object({ message: z.string() }),
          409: z
            .object({ message: z.string() })
            .describe('Upload already exists.'),
        },
      },
    },
    async (request, response) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, // 2MB
        },
      })

      if (!uploadedFile) {
        return response.status(400).send({ message: 'File is required.' })
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (uploadedFile.file.truncated) {
        return response
          .status(400)
          .send({ message: 'File size limit exceeded.' })
      }

      if (isSuccess(result)) {
        const { url } = unwrapEither(result)
        return response.status(201).send({ url })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidFileFormatError':
          return response.status(400).send({ message: error.message })
      }
    }
  )
}
