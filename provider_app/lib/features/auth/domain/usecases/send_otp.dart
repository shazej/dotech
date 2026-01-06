import 'package:dartz/dartz.dart';
import 'package:dotech_provider/core/error/failures.dart';
import 'package:dotech_provider/core/usecases/usecase.dart';
import '../repositories/auth_repository.dart';

class SendOtp implements UseCase<String, String> {
  final AuthRepository repository;

  SendOtp(this.repository);

  @override
  Future<Either<Failure, String>> call(String phone) async {
    return await repository.sendOtp(phone);
  }
}
