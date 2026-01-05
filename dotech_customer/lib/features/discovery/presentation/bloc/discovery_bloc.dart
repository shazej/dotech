import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:dotech_customer/features/discovery/domain/entities/service.dart';
import 'package:dotech_customer/features/discovery/domain/usecases/get_services.dart';

abstract class DiscoveryEvent extends Equatable {
  const DiscoveryEvent();
  @override
  List<Object?> get props => [];
}

class LoadServicesEvent extends DiscoveryEvent {
  final String? categoryId;
  const LoadServicesEvent({this.categoryId});
  @override
  List<Object?> get props => [categoryId];
}

abstract class DiscoveryState extends Equatable {
  const DiscoveryState();
  @override
  List<Object?> get props => [];
}

class DiscoveryInitial extends DiscoveryState {}

class DiscoveryLoading extends DiscoveryState {}

class DiscoveryLoaded extends DiscoveryState {
  final List<Service> services;
  const DiscoveryLoaded(this.services);
  @override
  List<Object?> get props => [services];
}

class DiscoveryError extends DiscoveryState {
  final String message;
  const DiscoveryError(this.message);
  @override
  List<Object?> get props => [message];
}

class DiscoveryBloc extends Bloc<DiscoveryEvent, DiscoveryState> {
  final GetServices getServicesUseCase;

  DiscoveryBloc({required this.getServicesUseCase})
    : super(DiscoveryInitial()) {
    on<LoadServicesEvent>((event, emit) async {
      emit(DiscoveryLoading());
      final result = await getServicesUseCase(event.categoryId);
      result.fold(
        (failure) => emit(DiscoveryError(failure.message)),
        (services) => emit(DiscoveryLoaded(services)),
      );
    });
  }
}
