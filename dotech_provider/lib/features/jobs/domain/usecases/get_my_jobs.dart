import 'package:dartz/dartz.dart';
import 'package:dotech_provider/core/error/failures.dart';
import 'package:dotech_provider/core/usecases/usecase.dart';
import '../entities/job.dart';
import '../repositories/jobs_repository.dart';

class GetMyJobs implements UseCase<List<Job>, NoParams> {
  final JobsRepository repository;

  GetMyJobs(this.repository);

  @override
  Future<Either<Failure, List<Job>>> call(NoParams params) async {
    return await repository.getMyJobs();
  }
}
