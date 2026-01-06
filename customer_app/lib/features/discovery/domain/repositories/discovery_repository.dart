import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import '../entities/service.dart';

abstract class DiscoveryRepository {
  Future<Either<Failure, List<Service>>> getServices(String? categoryId);
}
