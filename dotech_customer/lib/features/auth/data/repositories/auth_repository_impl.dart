import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/features/auth/domain/entities/user.dart';
import 'package:dotech_customer/features/auth/domain/repositories/auth_repository.dart';
import 'package:dotech_customer/features/auth/data/datasources/auth_remote_data_source.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, String>> sendOtp(String phone) async {
    try {
      final result = await remoteDataSource.sendOtp(phone);
      return Right(result);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Server Error'));
    }
  }

  @override
  Future<Either<Failure, User>> verifyOtp(String phone, String otp) async {
    try {
      final user = await remoteDataSource.verifyOtp(phone, otp);
      return Right(user);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Verification failed'));
    }
  }
}
