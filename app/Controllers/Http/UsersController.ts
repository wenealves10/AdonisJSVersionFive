import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const { username, email, name } = request.only(['name', 'email', 'username'])

    const userExists = await User.findBy('email', email)

    if (userExists) return response.status(400).send({ message: 'User already exists' })

    const user = await User.create({
      name,
      username,
      email,
    })

    return response.status(201).send(user)
  }

  public async index({ response }: HttpContextContract) {
    const users = await User.all()
    return response.status(200).send(users)
  }

  public async update({ request, response }: HttpContextContract) {
    const data = request.body()

    if (!Number(data.id)) return response.status(400).send({ message: 'ID Not number' })

    try {
      const user = await User.findOrFail(Number(data.id))
      await user.merge(data).save()
      return response.status(200).send({ message: 'Data updated with success' })
    } catch (error) {
      return response.status(400).json({ message: 'User already exists' })
    }
  }

  public async delete({ response, request }: HttpContextContract) {
    const { id } = request.params()

    if (!Number(id)) return response.status(400).send({ message: 'ID Not number' })

    try {
      const user = await User.findOrFail(Number(id))
      await user.delete()
      return response.status(200).json({ message: 'Delete with success' })
    } catch (error) {
      return response.status(400).json({ message: 'User not already exists' })
    }
  }
}
