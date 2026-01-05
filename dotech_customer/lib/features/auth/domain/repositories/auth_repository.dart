import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/features/auth/domain/entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, String>> sendOtp(String phone);
  Future<Either<Failure, User>> verifyOtp(String phone, String otp);
}
