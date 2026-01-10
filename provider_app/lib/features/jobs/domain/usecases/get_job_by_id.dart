import 'package:dartz/dartz.dart';
import 'package:dotech_provider/core/error/failures.dart';
import 'package:dotech_provider/features/jobs/domain/entities/job.dart';
import 'package:dotech_provider/features/jobs/domain/repositories/jobs_repository.dart';

class GetJobById {
  final JobsRepository repository;

  GetJobById(this.repository);

  Future<Either<Failure, Job>> call(String id) async {
    return await repository.getJobById(id);
  }
}
