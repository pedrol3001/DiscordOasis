import { container } from 'tsyringe';
import { SetGuildPrefixUseCase } from './SetGuildPrefixUseCase';

const SetGuildPrefixController = {
  async handle(id: string, prefix: string): Promise<void> {
    const setGuildPrefixUseCase = container.resolve(SetGuildPrefixUseCase);
    await setGuildPrefixUseCase.execute({ id, prefix });
  },
};

export { SetGuildPrefixController };
