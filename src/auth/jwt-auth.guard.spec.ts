import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './constants';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let reflectorMock: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    jest.clearAllMocks();
    reflectorMock = {
      getAllAndOverride: jest.fn(),
    } as any;
    jwtAuthGuard = new JwtAuthGuard(reflectorMock);
  });

  it('should return true if the route is public', () => {
    // Arrange
    mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    (reflectorMock.getAllAndOverride as jest.Mock).mockReturnValue(true);

    // Act
    const result = jwtAuthGuard.canActivate(mockContext);

    // Assert
    expect(result).toBe(true);
    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledWith(
      IS_PUBLIC_KEY,
      [mockContext.getHandler(), mockContext.getClass()],
    );
  });

  it('should call parent canActivate if the route is not public', () => {
    // Arrange
    mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    (reflectorMock.getAllAndOverride as jest.Mock).mockReturnValue(false);

    const parentActivateSpy = jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate')
      .mockReturnValue(true); // Mock the parent's canActivate method

    // Act
    const result = jwtAuthGuard.canActivate(mockContext);

    // Assert
    expect(result).toBe(true); // Assert the mocked behavior
    expect(parentActivateSpy).toHaveBeenCalledWith(mockContext); // Ensure parent's canActivate is called
    parentActivateSpy.mockRestore(); // Clean up spy
  });
});
